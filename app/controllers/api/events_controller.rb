module Api
  class EventsController < ApplicationController
    skip_before_action :authenticate, only: [:index, :show, :count]
    before_action :set_event, only: [:show, :update, :destroy]
    before_action :authorize_host!, only: [:update, :destroy]
    before_action :set_host_user, only: [:index, :count], if: -> { params[:host_id].present? }

    # GET /api/events?host_id=:host_id
    def index
      if @host_user
        @events = Event.where(host_id: @host_user.id)
      else
        @events = Event.all
      end
      render json: @events.as_json
    end

    # GET /api/events/count
    def count
      query_params = params.permit(:host_id, :since, :until)
      unless query_params[:until].present?
        query_params[:until] = Time.now
      end
      unless query_params[:since].present?
        query_params[:since] = Time.now - 1.month
      end

      @number = 0
      if query_params[:host_id].present?
        @number = Event.where(host_id: query_params[:host_id], date: query_params[:since]..query_params[:until]).count
      else
        @number = Event.where(date: query_params[:since]..query_params[:until]).count
      end

      render json: { count: @number }
    end

    # GET /api/events/:id
    def show
      @event = Event.find(params[:id])      
      json_event = @event.as_json(methods: [:accepted_users, :declined_users])
      render json: json_event
    end

    # POST /api/events
    def create
      create_params = event_params
      # Convert categories to a semicolon-separated string
      for category in create_params[:categories]
        if category.include?(";")
          render json: { error: "Categories cannot contain semicolons" }, status: :bad_request
          return
        end
      end
      create_params[:categories] = create_params[:categories].join(";")
      create_params[:host_id] = @user.id

      @event = Event.new(create_params)
      if @event.save
        render json: @event, status: :created
      else
        render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /api/events/:id
    def update
      @event = Event.find(params[:id])
      if @event.update(event_params)
        render json: @event
      else
        render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/events/:id
    def destroy
      @event = Event.find(params[:id])
      @event.destroy
      render json: { message: "Event deleted successfully" }, status: :ok
    end

    private

    # Find the event by ID
    def set_event
      @event = Event.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Event not found" }, status: :not_found
    end
    
    def authorize_host!
      unless @event.host_id == @user.id
        render json: { error: "You are not authorized to perform this action" }, status: :forbidden
      end
    end

    # Strong parameters to whitelist event fields
    def event_params
      params.require(:event).permit(:title, :date, :location, :description, :image, :host_id, categories: [])
    end

    def set_host_user
      @host_user = User.find_by(id: params[:host_id])
      unless @host_user
        render json: { error: "Host not found" }, status: :not_found
      end
    end
  end
end


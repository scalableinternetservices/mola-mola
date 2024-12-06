require 'date'

module Api
  class EventsController < ApplicationController
    skip_before_action :authenticate, only: [:index, :show, :count]
    before_action :try_authenticate, only: [:index, :show, :count]
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

      if @user.present?
        events_with_extra_field = @events.map do |event|
          event
            .as_json
            .merge(rsvp_status: event.rsvp_status(@user))
            .merge(followed_users: event.followed_users(@user))
        end
      else
        events_with_extra_field = @events
      end

      render json: events_with_extra_field
    end

    # GET /api/events/count
    def count
      query_params = params.permit(:since, :until)

      final_hash = Hash.new
      end_date = Date.parse(query_params[:until]) rescue Date.today
      start_date = Date.parse(query_params[:since]) rescue Date.today - 30.days

      (start_date..end_date).each do |date|
        beginning_time = date.beginning_of_day
        end_time = date.end_of_day

        if @host_user.present?
          event_count_per_date = Event.where(host_id: @host_user.id, date: beginning_time..end_time).count
        else
          event_count_per_date = Event.where(date: beginning_time..end_time).count
        end

        if event_count_per_date > 0
          final_hash[date] = event_count_per_date
        end
      end

      render json: final_hash
    end

    # GET /api/events/:id
    def show
      @event = Event.find(params[:id])
      if @user.present?
        json_event = @event.as_json.merge(
          rsvp_status: @event.rsvp_status(@user),
          followed_users: @event.followed_users(@user)
        )
      else
        json_event = @event.as_json
      end
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
      update_params = event_params
      if update_params[:categories].present?
        update_params[:categories].each do |category|
          if category.include?(";")
            render json: { error: "Categories cannot contain semicolons" }, status: :bad_request
            return
          end
        end
        update_params[:categories] = update_params[:categories].join(";")
      else
        update_params.delete(:categories)
      end
      
      if @event.update(update_params)
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


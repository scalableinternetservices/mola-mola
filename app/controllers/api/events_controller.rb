module Api
  class EventsController < ApplicationController
    skip_before_action :authenticate, only: [:index, :show]
    before_action :set_event, only: [:show, :update, :destroy]
    before_action :authorize_host!, only: [:update, :destroy]
    before_action :set_host_user, only: [:index], if: -> { params[:host_id].present? }

    # GET /api/events?host_id=:host_id
    def index
      if @host_user
        @events = Event.where(host_id: @host_user.id)
      else
        @events = Event.all
      end
      render json: @events
    end

    # GET /api/events/:id
    def show
      @event = Event.find(params[:id])
      render json: @event
    end

    # POST /api/events
    def create
      @event = Event.new(event_params)
      @event.host_id = @user.id
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
      params.require(:event).permit(:title, :date, :host_id)
    end

    def set_host_user
      @host_user = User.find_by(id: params[:host_id])
      unless @host_user
        render json: { error: "Host not found" }, status: :not_found
      end
    end
  end
end


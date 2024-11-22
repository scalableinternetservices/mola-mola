module Api
  class EventsController < ApplicationController
    skip_before_action :authenticate, only: [:index, :show, :create]
    # GET /api/events
    def index
      @events = Event.all
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

    # Strong parameters to whitelist event fields
    def event_params
      params.require(:event).permit(:title, :date, :host_id)
    end
  end
end


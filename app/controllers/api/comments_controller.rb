module Api
    class CommentsController < ApplicationController
      before_action :set_event
      before_action :set_comment, only: [:show, :update, :destroy]
      before_action :authorize_comment_owner!, only: [:update, :destroy]
      skip_before_action :authenticate, only: [:index, :show]
  
      # GET /api/events/:event_id/comments
      def index
        @comments = @event.comments
        render json: @comments
      end
  
      # GET /api/events/:event_id/comments/:id
      def show
        render json: @comment
      end
  
      # POST /api/events/:event_id/comments
      def create
        @comment = @event.comments.new(comment_params)
        @comment.user_id = @user.id
        if @comment.save
          render json: @comment, status: :created
        else
          render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
        end
      end
  
      # PATCH/PUT /api/events/:event_id/comments/:id
      def update
        if @comment.update(comment_params)
          render json: @comment
        else
          render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
        end
      end
  
      # DELETE /api/events/:event_id/comments/:id
      def destroy
        @comment.destroy
        render json: { message: "Comment deleted successfully" }, status: :ok
      end
  
      private
  
      # Find the event by ID
      def set_event
        @event = Event.find(params[:event_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Event not found" }, status: :not_found
      end
  
      # Find the comment by ID
      def set_comment
        @comment = @event.comments.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Comment not found" }, status: :not_found
      end
  
      # Check if the current user is the owner of the comment
      def authorize_comment_owner!
        unless @comment.user_id == @user.id
          render json: { error: "You are not authorized to perform this action" }, status: :forbidden
        end
      end
  
      # Ensure the user is authenticated
      def authenticate_user!
        unless @user
          render json: { error: "You must be logged in to perform this action" }, status: :unauthorized
        end
      end
  
      # Strong parameters to whitelist comment fields
      def comment_params
        params.require(:comment).permit(:content)
      end
    end
  end
  
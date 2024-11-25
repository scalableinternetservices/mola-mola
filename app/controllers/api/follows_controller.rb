module Api
  class FollowsController < ApplicationController
    # If :user_id present in params (which means requesting to /api/users/:user_id/follows), set @user to the user with that ID
    before_action :set_active_user, if: -> { params[:user_id].present? }
    # If :status present in params (which means requesting with ?status=pending/accepted/declined), validate the status
    before_action :validate_status, if: -> { params[:status].present? }, only: [:sent, :received]

    # GET /api/users/:user_id/follows/sent
    # Return the list of all follows sent by the user with the given ID, requires authentication
    # Success: return the list of all follows
    #  User does not exist: return 404 Not Found
    #  User is not the current user: return 403 Forbidden
    def sent
      unless params[:status].nil?
        @sent_follows = Follow.where(follower_id: @active_user.id, status: params[:status])
      else
        @sent_follows = Follow.where(follower_id: @active_user.id)                
      end
      render json: @sent_follows, status: :ok
    end

    # GET /api/users/:user_id/follows/received
    # Return the list of all follows received by the user with the given ID, requires authentication
    # Success: return the list of all follows
    #  User does not exist: return 404 Not Found
    #  User is not the current user: return 403 Forbidden
    def received
      unless params[:status].nil?
        @received_follows = Follow.where(followee_id: @active_user.id, status: params[:status])                
      else
        @received_follows = Follow.where(followee_id: @active_user.id)
      end
      render json: @received_follows, status: :ok
    end

    # GET /api/follows/:id
    # Return the follow with the given ID, requires authentication
    # Success: return the follow
    #   Follow does not belong to the current user: return 403 Forbidden
    #   Follow not found: return 404 Not Found
    def show
      begin
        follow = Follow.find(params[:id])
        if follow.follower_id == @user.id
          render json: follow, status: :ok
        else
          render json: { error: 'Looking at someone else\'s follow' }, status: :forbidden
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Follow not found' }, status: :not_found
      end
    end

    # POST /api/follows
    # Create a new follow, requires authentication
    # Success: return the new follow
    #  Follow already exists: return 400 Bad Request
    def create
      create_params = params.require(:follow).permit(:followee_id, :event_id)
      create_params[:follower_id] = @user.id
      # Check if the follow exists
      old_follow = Follow.find_by(follower_id: create_params[:follower_id], followee_id: create_params[:followee_id])
      unless old_follow.nil?
        return render(json: { error: 'Follow already exists', follow_id: old_follow.id }, status: :bad_request)
      end

      # If not, create the follow
      follow = Follow.new(create_params)
      if follow.save
        render json: follow, status: :created
      else
        render json: { error: 'Invalid response' }, status: :bad_request
      end
    end

    # DELETE /api/follows/:id
    # Delete the follow with the given ID, requires authentication
    # Success: return 200 OK
    #   Follow does not belong to the current user: return 403 Forbidden
    def destroy
      begin
        follow = Follow.find(params[:id])
        if follow.follower_id == @user.id
          follow.destroy
          render json: { message: 'Follow deleted successfully' }, status: :ok
        else
          render json: { error: 'Deleting someone else\'s follow' }, status: :forbidden
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Follow not found' }, status: :not_found
      end
    end

    private

    def set_active_user
      @active_user = User.find_by(id: params[:user_id])
      # Make sure that the user exists...
      unless @active_user
        render json: { error: 'User not found' }, status: :not_found
      end
      # And that it's the authenticated user
      unless @active_user.id == @user.id
        render json: { error: 'Unauthorized to view these follows' }, status: :unauthorized
      end
    end

    def validate_status
      unless %w[pending accepted declined].include? params[:status]
        render json: { error: 'Invalid status in request' }, status: :bad_request
      end
    end
  end
end
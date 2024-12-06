module Api
  class FollowsController < ApplicationController
    # If :user_id present in params (which means requesting to /api/users/:user_id/follows), set @user to the user with that ID
    before_action :set_active_user, if: -> { params[:user_id].present? }

    # GET /api/users/:user_id/follows/sent
    # Return the list of all follows sent by the user with the given ID, requires authentication
    # Success: return the list of all follows
    #  User does not exist: return 404 Not Found
    #  User is not the current user: return 403 Forbidden
    def sent
      @sent_follows = Follow.where(follower_id: @active_user.id)                
      render json: @sent_follows, status: :ok
    end

    # GET /api/users/:user_id/follows/received
    # Return the list of all follows received by the user with the given ID, requires authentication
    # Success: return the list of all follows
    #  User does not exist: return 404 Not Found
    #  User is not the current user: return 403 Forbidden
    def received
      @received_follows = Follow.where(followee_id: @active_user.id)
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
      create_params = params.require(:follow).permit(:followee_id)
      create_params[:follower_id] = @user.id

      if create_params[:follower_id] == create_params[:followee_id]
        return render(json: { error: 'User cannot follow oneself' }, status: :bad_request)
      end

      # Check if the follow exists
      old_follow = Follow.find_by(
        follower_id: create_params[:follower_id],
        followee_id: create_params[:followee_id])
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
    # Delete the follow where the follower is current user, followee is the user with the given ID, requires authentication
    # Success: return 200 OK
    #   Follow does not belong to the current user: return 403 Forbidden
    def destroy
      begin
        follow = Follow.find_by(follower_id: @user.id, followee_id: params[:id])
        follow.destroy
        render json: { message: 'Follow deleted successfully' }, status: :ok
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
      unless @active_user.id == @user.id || @active_user.privacy == 'public'
        render json: { error: 'Unauthorized to view these follows' }, status: :unauthorized
      end
    end

  end
end
module api
    class UsersController < ApplicationController
        skip_before_action :authenticate, only: [:index, :show]

        # GET /api/users
        # Return a list of all users, does not require authentication
        def index
            @users = User.all
            render json: @users, status: :ok
        end

        # GET /api/users/:id
        # Return the user with the given ID, does not require authentication
        def show
            begin
                user = User.find(params[:id])
                render json: user, status: :ok
            rescue ActiveRecord::RecordNotFound
                render json: { error: 'User not found' }, status: :not_found
            end
            # TODO: what could be other exceptions?
        end

        # PUT /api/users/:id
        # Update the user status with the given ID, only when the user themselves are logged in
        def update
            if @user.id == params[:id]
                begin
                    @user.update(user_params)
                    render json: @user, status: :ok # Successfully updated, return updated user status
                rescue # TODO: fill in proper exception type
                    render json: { error: 'Update failed' }, status: :bad_request # TODO: properly handle validation errors
                end            
            else
                render json: { error: 'Unauthorized' }, status: :unauthorized
            end
        end

        # DELETE /api/users/:id
        # Delete the user with the given ID, only when the user themselves are logged in
        def destroy
            if @user.id == params[:id]
                @user.destroy # TODO: will destroy fail? handle it if needed?
                render json: { message: 'User deleted' }, status: :ok
            else
                render json: { error: 'Unauthorized' }, status: :unauthorized
            end
        end

        private

        def user_params
            params.require(:user).permit(:email, :password, :password_confirmation)
        end
    end
end    
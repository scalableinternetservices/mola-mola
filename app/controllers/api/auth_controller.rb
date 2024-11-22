module Api
    class AuthController < ApplicationController
        skip_before_action :authenticate, only: [:register, :login]

        # POST /api/register
        def register
            @user = User.new(user_params)
            if @user.save
                token = ::JWT.encode({ user_id: @user.id }, Rails.application.secrets.secret_key_base)
                render json: {
                    token: token,
                    user: {
                        id: @user.id,
                        email: @user.email
                    }
                }, status: :created
            else
                # TODO: Return more detailed error messages and status codes
                render json: { error: @user.errors.full_messages }, status: :bad_request
            end
        end

        # POST /api/login
        def login
            @user = User.find_by(email: user_params[:email])
            if @user&.authenticate(user_params[:password])
                token = JWT.encode({ user_id: @user.id }, Rails.application.secrets.secret_key_base)
                render json: { 
                    token: token,
                    user: {
                        id: @user.id,
                        email: @user.email
                    }
                }, status: :ok
            else
                # TODO: Return more detailed error messages and status codes
                render json: { error: 'Invalid email or password' }, status: :unauthorized
            end
        end

        private

        def user_params
            params.require(:user).permit(:email, :password, :password_confirmation)
        end
    end
end
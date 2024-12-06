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
            username: @user.username,
            id: @user.id,
            email: @user.email
          }
        }, status: :created
      else
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
            username: @user.username,
            id: @user.id,
            email: @user.email,
            followed_users: @user.followed_users.map {
              |user| user.slice(:id, :username)
            },
            privacy: @user.privacy
          }
        }, status: :ok
      else
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    end

    # POST /api/upload
    def get_upload_url
      file_key = SecureRandom.hex(16)

      # Get a presigned URL for uploading a file to R2
      presigner = Aws::S3::Presigner.new(client: R2_CLIENT)
      presigned_url = presigner.presigned_url(
        :put_object,
        bucket: R2_BUCKET,
        key: file_key,
        expires_in: 3600,
      )

      render json: { url: presigned_url, key: file_key }, status: :ok
    end

    private

    def user_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation)
    end
  end
end
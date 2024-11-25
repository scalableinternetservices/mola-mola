class ApplicationController < ActionController::API
  before_action :authenticate

  def authenticate
    auth_header = request.headers['Authorization']
    if auth_header.present?
      token = auth_header.split(' ').last
      begin
        decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base)[0]
        @user = User.find(decoded_token['user_id'])
      rescue JWT::DecodeError
        render json: { error: 'Unauthorized during authentication' }, status: :unauthorized
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
      end
    else
      render json: { error: 'Authorization header missing' }, status: :unauthorized
    end
  end
end

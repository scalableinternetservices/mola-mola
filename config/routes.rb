Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # RESTful API of the service
  namespace :api do
    # GET /api/users, {GET,PUT,DELETE} /api/users/:id
    resources :users, only: [:index, :show, :update, :destroy]
    resources :users do
      # GET /api/users/:user_id/rsvps
      resources :rsvps, only: [:index]
      # GET /api/users/:user_id/invites/{sent,received}
      resources :invites, only: [:index] do
        collection do
          get :sent
          get :received
        end
      end
      # GET /api/users/:user_id/follows/{sent,received}
      resources :follows, only: [:index] do
        collection do
          get :sent
          get :received
        end
      end
    end
    resources :events, only: [:show, :create, :update, :destroy]
    # Add events and comments
    resources :events do
      resources :comments, only: [:index, :show, :create, :update, :destroy]
    end
    # POST /api/rsvps
    resources :rsvps, only: [:create]
    # POST /api/invites
    resources :invites, only: [:create]
    # POST /api/invites/:id/{accept,decline}
    resources :invites do
      member do
        post :accept
        post :decline
      end
    end
    # special routes for /register, /login and /profile
    post '/register', to: 'auth#register'
    post '/login', to: 'auth#login'
    get '/profile', to: 'auth#profile'
    post '/upload', to: 'auth#get_upload_url'
  end

  # Defines the root path route ("/")
  # root "posts#index"
end

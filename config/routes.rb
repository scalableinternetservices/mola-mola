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
    # Leave everything here for now, add specific routes after controllers are implemented
    resources :users, only: [:index, :show, :update, :destroy]
    resources :events
    resources :rsvps
    resources :invites
    resources :comments
    resources :follows
    # special routes for /register, /login and /profile
    post '/register', to: 'auth#register'
    post '/login', to: 'auth#login'
    get '/profile', to: 'auth#profile'
  end

  # Defines the root path route ("/")
  # root "posts#index"
end

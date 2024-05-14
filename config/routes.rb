Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  
  # action cable server
  mount ActionCable.server => "/cable"

  # Defines the root path route ("/")
  
  namespace :api do
    namespace :v1 do
      post "login", to: "sessions#create", as: "login"
      delete "logout", to: "sessions#destroy", as: "logout"
      post "signup", to: "registrations#create", as: "signup"
      post "change_password", to: "passwords#update", as: "change_password"
      post "forgot_password", to: "password_resets#create", as: "forgot_password"
      put "reset_password", to: "password_resets#update", as: "reset_password"
      get "attendances", to: "attendances#index", as: "attendances"
      post "remote_clock_in", to: "attendances#create", as: "remote_clock_in"
      put "remote_clock_out", to: "attendances#update", as: "remote_clock_out"
      resources :messages, only: [:index, :create]
      resources :rooms, only: [:index, :create, :show]
    end
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
end

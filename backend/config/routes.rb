Rails.application.routes.draw do
  root 'toppages#home'
  namespace :api do
    namespace :v1 do
      resources :users
      get 'login', to: 'user_sessions#new'
      post 'login' => 'user_sessions#create'
      delete 'logout' => 'user_sessions#destroy', :as => :logout
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check
end

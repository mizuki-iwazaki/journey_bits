Rails.application.routes.draw do
  root 'toppages#home'
  namespace :api, format: 'json' do
    namespace :v1 do
      resource :registration, only: %i[create]
      resource :authentication, only: %i[create destroy]
      resources :themes, only: %i[index create destroy]
      resources :posts, only: %i[index show create update destroy]
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check
end

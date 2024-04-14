Rails.application.routes.draw do
  root 'toppages#home'
  get '/legal/terms_of_service', to: 'legal_documents#terms_of_service'
  get '/legal/privacy_policy', to: 'legal_documents#privacy_policy'

  namespace :api, format: 'json' do
    namespace :v1 do
      resource :registration, only: %i[create update]
      resource :authentication, only: %i[create destroy] do
        collection do
          post 'guest_login'
        end
      end
      resources :password_resets, only: [] do
        collection do
          post 'validate'
          post 'reset'
        end
      end
      resources :themes, only: %i[index show create update destroy]
      resources :posts, only: %i[index show create update destroy] do
        collection do
          get :liked_posts
          get :bookmarked_posts
        end
      end
      resources :posts do
        resource :likes, only: %i[create destroy]
        resource :bookmarks, only: %i[create destroy]
      end
      resources :maps, only: %i[index]
      resources :albums, only: %i[index]
      resource :mypage, only: %i[show update]
      resources :inquiries, only: %i[index create]
      resources :recommendations, only: %i[index]
    end
  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check
end

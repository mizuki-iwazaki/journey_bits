module Api
  module V1
    class BaseController < ApplicationController
      include Api::ExceptionHandler
      include ActionController::HttpAuthentication::Token::ControllerMethods

      before_action :authenticate

      protected

      def authenticate
        authenticate_or_request_with_http_token do |token, _options|
          @_current_user ||= ApiKey.active.find_by(access_token: token)&.user
        end
      end

      def current_user
        @_current_user
      end

      def set_access_token!(user)
        api_key = user.activate_api_key!
        response.headers['AccessToken'] = api_key.access_token
      end

      def check_guest_user
        if current_user.guest?
          render json: { error: 'Guest users are not allowed to perform this action' }, status: :forbidden
        end
      end

      private

      # https://github.com/NoamB/sorcery/issues/724
      # https://qiita.com/okaeri_ryoma/items/0d01469f2265e5d51af1
      def form_authenticity_token; end
    end
  end
end

module Api do
  module V1 do
    class UserSessionsController < ApplicationController
      skip_before_action :require_login, only: %i[new create]

      def new; end

      def create
        @user = login(login_params)
        if @user
          # ユーザーが正常にログイン
          render json: { status: 'success', message: 'Logged in successfully.' }
        else
          # ログイン失敗
          render json: { status: 'error', message: 'Login failed.' }, status: :unauthorized
        end
      end

      def destroy
        logout
      end

      private

      def login_params
        params.permit(:email, :password)
      end
    end
  end
end

module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: %i[show edit update destroy]
      # skip_before_action :require_login, only: %i[new create]

      def new
        @user = User.new
      end

      def show; end

      def edit; end

      def create
        @user = User.new(user_params)
        if @user.save
          render json: { status: 'success', message: 'User was successfully created.' }, status: :created
        else
          render json: { status: 'error', errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @user.update(user_params)
          render json: { status: 'success', messages: 'User was successfully updated.' }
        else
          render json: { status: 'error', errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @user.destroy
          render json: { status: 'success', message: 'User was successfully destroyed.' }
        else
          render json: { status: 'error', message: 'Failed to destroy user.' }, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end
    end
  end
end

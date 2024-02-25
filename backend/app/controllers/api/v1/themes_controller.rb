module Api
  module V1
    class ThemesController < BaseController
      skip_before_action :authenticate, only: %i[index]
      before_action :authorize_admin, only: %i[create update destroy]
      before_action :set_theme, only: %i[show update destroy]

      def index
        @themes = Theme.all
        render json: @themes
      end

      def create
        @theme = current_user.themes.new(theme_params)
        if @theme.save
          render json: @theme, status: :created
        else
          render json: @theme.errors, status: :unprocessable_entity
        end
      end

      def show
        render json: @theme
      end

      def update
        if @theme.update(theme_params)
          render json: @theme
        else
          render json: @theme.errors, status: :unprocessable_entity
        end
      end

      def destroy
        @theme.destroy!
        head :no_content
      end

      private

      def set_theme
        @theme = Theme.find(params[:id])
      end

      def theme_params
        params.require(:theme).permit(:name)
      end

      def authorize_admin
        raise ActiveRecord::RecordNotFound, 'Not Found' unless current_user.admin?
      end
    end
  end
end

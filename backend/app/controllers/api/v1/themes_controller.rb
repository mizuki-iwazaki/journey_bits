module Api
  module V1
    class ThemesController < BaseController
      skip_before_action :authenticate, only: %i[index]
      before_action :authorize_admin, only: %i[create]

      def index
        @themes = Theme.all
        render json: @themes
      end

      def create
        @theme = Theme.new(theme_params)
        @theme.save!
        render json: @theme, status: :created
      rescue ActiveRecord::RecordInvalid
      end

      private

      def theme_params
        params.require(:theme).permit(:name)
      end

      def authorize_admin
        raise ActiveRecord::RecordNotFound, 'Not Found' unless current_user.admin?
      end
    end

  end
end

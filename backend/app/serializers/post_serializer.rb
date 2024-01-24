class PostSerializer
  include FastJsonapi::ObjectSerializer

  attributes :content, :status

  attribute :location do |post|
    if post.location
      {
        name: post.location.name,
        latitude: post.location.latitude,
        longitude: post.location.longitude,
        address: post.location.address
      }
    end
  end

  attribute :image_urls do |post|
    post.images.map do |image|
      {
        id: image.id,
        url: image.image_file.url(:index_size)
      }
    end
  end

  attribute :liked_by_user do |post, params|
    post.likes.exists?(user_id: params[:current_user_id])
  end

  attribute :likes_count do |post|
    post.likes.count
  end

  belongs_to :user
  belongs_to :theme
end

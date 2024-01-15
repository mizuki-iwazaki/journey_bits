class PostSerializer
  include FastJsonapi::ObjectSerializer

  attributes :content, :status

  attribute :image_urls do |post|
    post.images.map do |image|
      {
        id: image.id,
        url: image.image_file.url(:index_size)
      }
    end
  end

  belongs_to :user
  belongs_to :theme
end

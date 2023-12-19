class PostSerializer
  include FastJsonapi::ObjectSerializer
  attributes :content, :status

  belongs_to :user
  belongs_to :theme
end

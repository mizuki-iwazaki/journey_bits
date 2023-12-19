class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.references :theme, null: false, foreign_key: true
      t.references :user, null:false, foreign_key: true
      t.text :content, null: false
      t.integer :status, default: 0, null: false

      t.timestamps
    end
  end
end

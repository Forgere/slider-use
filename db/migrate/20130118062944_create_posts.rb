class CreatePosts < ActiveRecord::Migration
  def up
    create_table :posts do |t|
      t.timestamps
      t.string :title
      t.text :content
      t.integer :page_id
    end
  end

  def down
    drop_table :posts
  end
end
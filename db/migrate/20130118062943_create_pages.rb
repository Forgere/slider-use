class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :title
      t.string :slug
      t.string :identity
      t.string :redirect
      t.text :content
      t.integer :lft
      t.integer :rgt
      t.integer :parent_id
      t.string :meta_title
      t.string :meta_description
      t.string :meta_keywords

      t.timestamps
    end
  end
end

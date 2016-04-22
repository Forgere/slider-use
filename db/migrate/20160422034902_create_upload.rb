class CreateUpload < ActiveRecord::Migration
  def up
    create_table :uploads do |t|
      t.timestamps
      t.string :name
      t.string :mobile
      t.string :img
      t.integer :type
      t.string :city
      t.integer :is_contact
      t.integer :page_id
    end
  end

  def down
    drop_table :uploads
  end
end
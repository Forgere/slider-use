class AddOriginToUploads < ActiveRecord::Migration
  def change
  	add_column :uploads, :origin, :string
  end
end

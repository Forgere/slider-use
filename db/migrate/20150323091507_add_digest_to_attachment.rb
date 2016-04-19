class AddDigestToAttachment < ActiveRecord::Migration
  def change
    add_column :attachments, :digest, :string
  end
end

class AddVoteIdToUpload < ActiveRecord::Migration
  def change
  	add_column :uploads, :vote_id, :integer
  	add_column :uploads, :vote_count, :integer, default: 0
  end
end

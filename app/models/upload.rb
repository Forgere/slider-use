class Post < ActiveRecord::Base
  include Amalgam::Types::Base
  mount_uploader :img, AttachmentUploader
  attr_accessible :name, :mobile, :img, :type, :city, :is_contact
  paginates_per 20
  default_scope { order("created_at desc") }
end
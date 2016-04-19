class Post < ActiveRecord::Base
  include Amalgam::Types::Base
  include Amalgam::Types::Contentable
  include Amalgam::Types::Attachable
  has_content
  attr_accessible :title, :page_id, :content, :attachments_attributes
  belongs_to :page
  paginates_per 20
  default_scope { order("created_at desc") }
end

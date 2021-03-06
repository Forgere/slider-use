class Upload < ActiveRecord::Base
  include Amalgam::Types::Base
  mount_uploader :img, ImgUploader
  attr_accessible :name, :mobile, :img, :upload_type, :city, :is_contact, :original_filename, :vote_id, :vote_count, :origin
  attr_accessor :captcha
  validates :name, format: { with: /\A[a-zA-Z0-9_\u4e00-\u9fa5]{1,100}\z/,
    message: "2个字符以上，支持中文或英文，不含空格及特殊符号" }
  validates :mobile, format:{ with: /\A[0-9]{11}\z/,
    message: "必须填写正确的手机号码"
  }
  validates :mobile, uniqueness: true
  validates :name, :mobile, :city, :is_contact, presence: true
  paginates_per 20
  default_scope { order("created_at desc") }
end
class Page < ActiveRecord::Base
  include Amalgam::Types::Page
  include Amalgam::Types::Attachable
  include Amalgam::Types::Taggable

  taggable
  attr_accessible :parent_id, :tag_list, :left_id, :right_id, :content, :slug,
                  :title, :identity, :redirect, :attachments_attributes,
                  :meta_title, :meta_description, :meta_keywords
  has_many :posts
  has_content

  ##
  # 指定此模型查找模型所使用的字段
  # 模板名称默认为 slug 当设定indentity 后使用 identity 名
  # 上述名称查找不到时 使用 @tag_name 进行查找
  # 更多模板查找规则参照: http://wiki.xtunes.cn/amalgam-template-rule
  #
  def template_keys
    template_name = identity.present? ? identity : slug
    [template_name].concat(tags.map { | tag | "@#{tag}" })
  end
end

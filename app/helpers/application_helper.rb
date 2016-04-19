module ApplicationHelper
  ##
  # Examples:
  # <%- body_class << 'home'
  # <%- body_attrs(ng_app: 'app')
  # <%= body_tag do %>
  #   ...
  # <%- end -%>
  #
  #
  def body_tag(options = {}, &block)
    cls = []
    cls << body_class
    cls << options.delete(:class)
    cls << "#{params[:controller]}_controller"
    cls << [params[:action], params[:controller]].join('_')
    cls << I18n.locale.to_s
    cls << Rails.env
    cls = cls.flatten.compact.map(&:parameterize).join(' ')
    options.merge!(body_attrs)
    options[:class] = cls
    content_tag :body, options, &block
  end

  def body_class
    @body_class ||= []
  end

  def body_attrs(attrs = {})
    @body_attrs ||= {}
    @body_attrs.merge!(attrs)
  end

  def default_body_class_for(page)
    cls = []
    cls << page.slug if page.respond_to?(:slug)
    cls.concat(page.tags.map { |t| "tag_#{t}" }) if page.respond_to?(:tags)
    cls.compact
  end

  def current_class(item, options = {})
    current_item = options[:current_item] || @page
    class_string = options[:class] || 'current'
    method = (!options[:exact]) ? :is_or_is_ancestor_of? : :==
    return class_string if current_item.present? && item.send(method, current_item)
    nil
  end

  def default_for(name, &block)
    if content_for?(name)
      content_for(name)
    else
      capture(&block)
    end
  end

  ##
  # 生成页面的标题Tag, text为页面的标题, suffix页面标题后缀

  def title_tag(text = nil, suffix = nil)
    title = [text, suffix].compact.join(' - ')
    content_tag(:title, title)
  end

  def title_tag_for(page_with_title, suffix = nil)
    priority = [:meta_title, :title, :name]
    field = priority.detect do | f |
      page_with_title.respond_to?(f) && page_with_title.send(f).present?
    end
    title_tag(page_with_title.send(field), suffix)
  end

  ##
  # 从附件或是asset中获取图片的url,如果附件存在并且是图片,则返回fallback里的asset图片文件路径
  #

  def fetch_image(attachment, fallback)
    if attachment.blank? || !attachment.content_type =~ /image/
      image_path(fallback)
    else
      attachment.file.url
    end
  end
end

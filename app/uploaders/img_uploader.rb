# encoding: utf-8
class ImgUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick
  # # see https://github.com/jnicklas/carrierwave/wiki/How-to%3A-Create-random-and-unique-filenames-for-all-versioned-files
  before :cache, :save_original_filename
  def save_original_filename(file)
    model.original_filename ||= file.original_filename if file.respond_to?(:original_filename)
  end

  # see https://github.com/jnicklas/carrierwave/wiki/How-to%3A-Create-random-and-unique-filenames-for-all-versioned-files
  def filename
     "#{secure_token}.#{file.extension}" if original_filename.present?
  end

  storage :file

  def store_dir
    File.join("#{Rails.root}/attachments/files", "upload")
  end

  def url
    "/#{model.class.to_s.tableize}/#{model.id}"
  end

  version :thumb , :if => :image? do
    process :resize_to_fill => [32, 32]
  end

  version :list do
    process :resize_to_fill => [232, 154]
  end

  def cache_dir
    "#{Rails.root}/attachments/files/temp"
  end

  def extension_white_list
    nil
  end

  def secure_token
    var = :"@#{mounted_as}_secure_token"
    model.instance_variable_get(var) or model.instance_variable_set(var, "#{sha}-#{Time.now.to_i}")
  end

  protected

  def sha
    chunk = model.send(mounted_as)
    Digest::SHA1.hexdigest(chunk.read.to_s)
  end

  # # see https://github.com/jnicklas/carrierwave/wiki/How-to%3A-Do-conditional-processing
  def image?(new_file)
    (new_file.content_type || []).include? 'image'
  end
end

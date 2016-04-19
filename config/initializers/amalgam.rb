require 'dragonfly/rails/images'
Amalgam.setup do |config|
  config.type_whitelist = ['Page','Post']
  config.models_with_templates = ['pages','posts']
  config.mercury_link_whitelist = "(\\\/(pages|posts))|(^\\\/$)"
  config.accepted_formats = [".haml", ".erb", '.slim']
  config.admin_routes do
    namespace :admin do
      amalgam_resources :pages, :except => [:show]
      amalgam_resources :posts
    end
  end
end

CarrierWave::SanitizedFile.sanitize_regexp = /[^[:word:]\.\-\+]/
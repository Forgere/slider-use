source 'https://ruby.taobao.org'

gem 'rails', '3.2.21'
gem 'bcrypt-ruby', '~> 3.0.0'
gem 'mysql2'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'sass', '~> 3.2.13'

  # See https://github.com/sstephenson/execjs#readme for more supported runtimes
  # gem 'therubyracer', :platforms => :ruby
  gem 'turbo-sprockets-rails3', '~> 0.3.0'
  gem 'uglifier', '>= 1.0.3'
  gem 'pie-rails'
  gem 'jquery-rails', '~>2.2'

  # 自动合并 media query
  gem 'sprockets-media_query_combiner'
  gem "autoprefixer-rails"
end

# The Gems for Amalgam
gem 'amalgam', git: 'git@git.xtunes.cn:xtunes/cms.git', branch: '4.0'
gem 'rails_config'
gem 'slim', '2.0.0'

gem 'mediaelement_rails'

gem 'xtunes_helpers', git: 'git@xtunes.cn:xtunes/helper.git'

# The Gems for Test
gem 'quiet_assets', '>= 1.0.1', group: :development
group :test, :development do
  gem 'rb-fsevent'
  gem 'guard'
  gem 'guard-bundler', '>= 0.1.3'
  gem 'guard-pow', '>= 1.0.0'
  gem 'guard-livereload', '>= 0.3.0'
end

group :deploy do
  gem 'capistrano', '~> 2.15.0'
  gem 'rvm-capistrano'
end

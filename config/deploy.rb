#  need rvm version > 1.12
require 'capistrano/maintenance'
require 'rvm/capistrano'
require 'bundler/capistrano'

#  uncomment following lines for multistage deploy
# set :stages, %w(production)
# set :default_stage, "production"
# require 'capistrano/ext/multistage'

#  User settings
set :user, 'webadmin'
set :group, 'www-data'

# RVM settings
set :rvm_path, '/usr/local/rvm'
set :rvm_bin_path, '/usr/local/rvm/bin/'
set :rvm_ruby_string, 'ruby-2.1.4'

# Passenger settings
set :passenger_ruby, "/usr/local/rvm/wrappers/#{rvm_ruby_string}/ruby"

# Nginx settings
set :global_access_log, '/var/log/nginx/access.log main'

# Application settings
set :application, 'roewe360'
set :alias, ["#{application}.xtunes.cn"]

# Server settings
server 'xtunes.cn', :app, :web, :db, :primary => true
set :web_server, :nginx
set :app_server, :passenger
set :application_port, 80
# set :application_uses_ssl, false
# set :application_port_ssl, 443


# Database settings
set :database, :mysql

# 是否使用 bower
# set :bower, true

# 是否使用 Amalgam
set :amalgam, true

# Sync settings
# set :sync_directories, %w(system)
if fetch(:amalgam, false)
  set :sync_directories, fetch(:sync_directories,[]) + %w( images attachments )
end
# set :sync_backups, 3

# Remote Configs
set :remote_configs, %w(database.yml secrets.yml)

# Shared settings
# set :shared_children, fetch(:shared_children)


if fetch(:amalgam, false)
  set :shared_children, fetch(:shared_children) + %w( images attachments )
end

if fetch(:bower, false)
  set :shared_children, fetch(:shared_children) + %w( vendor/assets/components )
  before 'deploy:assets:precompile', 'deploy:bower:install'
end

# SCM settings
set :scm, :git
set :branch, 'master'
set :deploy_to, "/srv/apps/#{application}"
set :repository,  "git@git.xtunes.cn:pro/#{application}.git"
# set :deploy_via, :remote_cache
# set :keep_releases, 3

after 'deploy:db:symlink', 'deploy:migrate'
after 'deploy:update', 'deploy:cleanup'

#  Must be loaded after settings
require 'xtunes/capistrano/recipes'

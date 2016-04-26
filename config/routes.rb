Cms::Application.routes.draw do
  captcha_route

  resources :pages, :only => [:show]
  resources :posts, :only => [:show]
  resources :uploads, :only => [:create, :show] do
  	get 'export', on: :collection
  end
  mount Amalgam::Engine => '/'
  root :to => 'pages#show' , :defaults => {:id => 'home'}
end
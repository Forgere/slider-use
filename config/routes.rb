Cms::Application.routes.draw do
  captcha_route

  resources :pages, :only => [:show]
  resources :posts, :only => [:show]
  resources :uploads, :only => [:create, :show, :index] do
  	get 'export', on: :collection
  	get 'thumb', on: :member
  end
  mount Amalgam::Engine => '/'
  root :to => 'pages#show' , :defaults => {:id => 'home'}
end
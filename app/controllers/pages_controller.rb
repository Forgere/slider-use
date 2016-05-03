class PagesController < ApplicationController
  include Amalgam::TemplateFinder

  before_filter :switch_mobile, :only => [:show]
  layout :false

  def show
    @page = Page.where(:slug => params[:id]).first
    raise ActiveRecord::RecordNotFound , "Couldn't find page with slug=#{params[:id]}" if @page.blank?
    render template_for(@page)
  end

  def index
    @microposts = Page.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @microposts }
    end
  end

  private

  def switch_mobile
    logger.info request.env["HTTP_USER_AGENT"]
    params[:id] = 'mobile' if request.env["HTTP_USER_AGENT"].match(/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/) && params[:id] == 'home'
  end
end

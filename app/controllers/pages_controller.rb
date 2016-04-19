class PagesController < ApplicationController
  include Amalgam::TemplateFinder
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
end

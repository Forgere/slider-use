class UploadsController < ApplicationController

  def create
    if(params[:vote_id])
      params[:upload][:vote_id] = params[:vote_id]
    end
    captcha = params[:upload].delete(:captcha)
    if captcha_valid? captcha
      @upload = Upload.where(mobile: params[:upload][:mobile]).first
      if @upload && @upload.vote_id && params[:vote_id]
        respond_to do |format|
          format.html{
            render text: "您已经点赞过"
          }
        end
      elsif @upload && @upload.img
        respond_to do |format|
          format.html{
            render text: "您已经上传过照片"
          }
        end
      else
        @upload ||= Upload.new(params[:upload])
        @upload.vote_id = params[:vote_id] if params[:vote_id]
        respond_to do |format|
          if(@upload.save)
            format.html{
              if(params[:vote_id])
                upload = Upload.find(params[:vote_id])
                upload.vote_count = upload.vote_count + 1
                upload.save
                render text: '点赞成功'
              else
                render text: '上传成功'
              end
            }
          else
            format.html{
              logger.info @upload.errors.inspect
              render text: '字段填写不全或者格式错误'
            }
          end
        end
      end
    else
      respond_to do |format|
        format.html{
          render text: '验证码错误'
        }
      end
    end
  end

  def show
    upload = Upload.find(params[:id])
    send_file upload.img.file.path
  end
end
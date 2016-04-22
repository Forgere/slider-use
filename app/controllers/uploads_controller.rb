class UploadsController < ApplicationController

  def create
    captcha = params[:upload].delete(:captcha)
    if captcha_valid? captcha
      @upload = Upload.new(params[:upload])
      respond_to do |format|
        if(@upload.save)
          format.html{
            render text: '上传成功'
          }
        else
          format.html{
            render text: '手机号已经被使用或者字段填写不全或者格式错误'
          }
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
end
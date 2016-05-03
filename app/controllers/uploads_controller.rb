class UploadsController < ApplicationController
  http_basic_authenticate_with name: "admin", password: "admin1234", only: :export
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
          format.js{
            @text = "您已经点赞过"
          }
        end
      elsif @upload && @upload.img && !params[:vote_id]
        respond_to do |format|
          format.html{
            render text: "您已经上传过照片"
          }
          format.js{
            @text = "您已经上传过照片"
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
                render text: "#{@upload.img.url};#{@upload.upload_type}"
              end
            }
            format.js{
              if(params[:vote_id])
                upload = Upload.find(params[:vote_id])
                upload.vote_count = upload.vote_count + 1
                upload.save
                @text = '点赞成功'
              else
                @text = "#{@upload.img.url};#{@upload.upload_type}"
              end
            }
          else
            format.html{
              logger.info @upload.errors.inspect
              render text: '字段填写不全或者格式错误'
            }
            format.js{
              @text = '字段填写不全或者格式错误'
            }
          end
        end
      end
    else
      respond_to do |format|
        format.html{
          render text: '验证码错误'
        }
        format.js{
          @text = "验证码错误"
        }
      end
    end
  end

  def show
    upload = Upload.find(params[:id])
    if params[:thumb] == 'list'
      send_file upload.img.list.file.path, disposition: 'inline'
    else
      send_file upload.img.file.path, disposition: 'inline'
    end
  end

  def thumb
    upload = Upload.find(params[:id])
    send_file upload.img.list.file.path, disposition: 'inline'
  end

  def export
    sql = 'select name as "姓名",mobile as "手机号",city as "城市",(case when is_contact > 0 then "可以联系" else "不可以联系" end) as "是否可以联系",created_at as "提交日期", (case when vote_id > 0 then "点赞" else "没点赞" end) as "是否点赞", (case when original_filename is not NULL then "上传照片" else "没有上传照片" end) as "是否上传照片", (case when upload_type = 1 then "荣威360强劲动力，再高的坡也能爬!" when upload_type = 2 then "低油耗!想去哪儿就去哪儿!" when upload_type = 3 then "荣威360超大空间，全家出游So easy！" else "" end) as "口号" from uploads'
    @records = ActiveRecord::Base.connection.execute(sql)
    respond_to do |format|
      format.xlsx
    end
  end
end
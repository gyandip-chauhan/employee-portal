module Api::V1
  class PdfsController < ApplicationController
    before_action :validate_pdf, only: [:add_signature, :add_stamp]
    before_action :validate_signature, only: [:add_signature]

    def add_signature
      x, y, page, position = extract_pdf_params
      signature_path = @signature.tempfile.path
      
      output_path = Pdf::Master::Signature.add_signature(@pdf_path, signature_path, x, y, page, position)
      
      render_pdf_response(output_path, "Signature added!")
    end

    def add_stamp
      text, x, y, page, position = extract_stamp_params
      
      output_path = Pdf::Master::Stamp.add_stamp(@pdf_path, text, x, y, page, position)
      
      render_pdf_response(output_path, "Stamp added!")
    end

    private

    def validate_pdf
      file = params[:pdf]
      return render_error("Missing PDF file") unless file
      return render_error("Invalid file type. Only PDFs are allowed.", :unprocessable_entity) unless file.content_type == "application/pdf"
      
      @pdf_path = save_uploaded_file(file, "pdf")
    end

    def validate_signature
      @signature = params[:signature]
      return render_error("Missing signature file") unless @signature
      
      valid_image_types = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
      return render_error("Invalid signature format. Only images are allowed (PNG, JPG, JPEG, WEBP).", :unprocessable_entity) unless valid_image_types.include?(@signature.content_type)
    end

    def extract_pdf_params
      [params[:x].to_i, params[:y].to_i, params[:page].to_i, params[:position]]
    end

    def extract_stamp_params
      return render_error("Missing stamp text") unless params[:text].present?
      [params[:text], params[:x].to_i, params[:y].to_i, params[:page].to_i, params[:position]]
    end

    def render_pdf_response(output_path, success_message)
      if output_path
        render json: { message: success_message, url: pdf_url(output_path) }
      else
        render_error("Invalid page number.", :unprocessable_entity)
      end
    end

    def render_error(message, status = :bad_request)
      render json: { error: message }, status: status
    end

    def save_uploaded_file(file, type)
      temp_file = Tempfile.new(["upload_", ".#{type}"])
      temp_file.binmode
      temp_file.write(file.read)
      temp_file.rewind
      temp_file.path
    end

    def pdf_url(file_path)
      request.base_url + "/uploads/#{File.basename(file_path)}"
    end
  end
end

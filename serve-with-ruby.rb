#!/usr/bin/env ruby
# encoding: utf-8

require 'webrick'
require 'uri'

class MyServlet < WEBrick::HTTPServlet::FileHandler
  def initialize(server, folder)
    super(server, folder)
  end

  def do_GET (request, response)
    if URI.escape(request.path) == request.path
      super(request, response)
    elsif request.path.end_with? '.json'
      fn = request.path.force_encoding('UTF-8')[1..-1]
      if !File.exist? fn
        response.status = 404
        return
      end
      text = IO.read fn
      response.content_type = 'application/json; charset=utf-8'
      response.status = 200
      response.body = text
    else
      response.status = 404
    end
  end
end

class Main
  def initialize
    @webroot = '.'
  end

  def main
    server = WEBrick::HTTPServer.new(:Port => 9090)
    server.mount '/', MyServlet, @webroot

    trap("INT") {
      server.shutdown
      @readers.map(&:clear)
    }
    server.start
  end
end

if __FILE__ == $PROGRAM_NAME
  Main.new.main
end
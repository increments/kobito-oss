# Upload images to s3
# See detail at https://increments.qiita.com/yuku_t/items/0a2d071eb1d5dba87f2e

# (file: File, teamId: string) => Promise<Object>
module.exports = uploadFileToS3 = (file, teamId) ->
  _postUploadPolicy(file, teamId)
  .then (data) -> _upload(file, data)

# Fetch upload policy from qiita
# (file: File, teamId: string) => Promise<Object>
_postUploadPolicy = (file, teamId) -> new Promise (done, reject) ->
  token = app.config.getAPIToken()
  unless token
    return reject new Error 'No token'

  uploadPolicyUrl =
    if teamId is 'qiita'
      "https://qiita.com/api/v2/upload_policies"
    else
      "https://#{teamId}.qiita.com/api/v2/upload_policies"

  xhr = new XMLHttpRequest
  xhr.open 'POST', uploadPolicyUrl, true
  xhr.setRequestHeader("Authorization", "Bearer " + app.config.getAPIToken())
  xhr.setRequestHeader("Content-Type", "application/json")

  xhr.onerror = (e) -> reject(new Error 'Upload failed')
  xhr.onload = (e) ->
    status = e.target.status
    data =
      try
        JSON.parse(e.target.responseText)
      catch
        null

    if status not in [200, 201] or !data
      switch status
        when 403 then return reject new Error 'Forbidden'
        when 413 then return reject new Error 'Size exceeded'
        when 422 then return reject new Error 'Policy validation failed'
      reason = data?.errors?.join('; ') ? data?.error ? ''
      return reject new Error "Unknown error #{status} (#{reason})"

    done(data)

  xhr.send JSON.stringify
    content_type: file.type
    name: file.name ? 'no_name'
    size: file.size

# Upload to s3 by policy
# (file: File, data: Object) => Promise<Object>
_upload = (file, data) -> new Promise (done, reject) ->
  fd = new FormData
  fd.append(k, v) for k, v of data.form_data
  fd.append('file', file)
  xhr = new XMLHttpRequest
  xhr.open('POST', "https://#{data.bucket}.s3.amazonaws.com/", true)
  xhr.onerror = (e) -> reject(new Error 'Upload to S3 failed')
  xhr.onload = (e) -> done(data)
  xhr.send(fd)

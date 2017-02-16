require '../../spec-helper'

describe 'domains/commands', ->
  context 'ensureUserId', ->
    context 'without token', ->
      afterEach ->
        localStorage.clear()
      it 'throw', (done) ->
        kaita.commands.ensureUserId()
        .then -> done 1
        .catch -> done()

    context 'with token', ->
      beforeEach ->
        localStorage.setItem 'api-token', 'xxx'
        afterEach -> localStorage.clear()

      context 'without id', ->
        context 'with regular request result', ->
          beforeEach ->
            localStorage.removeItem('login-id')
            @sinon.stub(Qiita.Resources.User, 'get_authenticated_user')
              .returns Promise.resolve id: 'aaaa'

          xit 'fetch data.id', ->
            kaita.commands.ensureUserId()
            .then ->
              assert localStorage.getItem('login-id'), 'aaaa'

        context 'without regular request result', ->
          beforeEach ->
            localStorage.removeItem('login-id')
            @sinon.stub(Qiita.Resources.User, 'get_authenticated_user')
              .returns Promise.resolve {}

          xit 'throw', (done) ->
            kaita.commands.ensureUserId()
            .catch (e) ->
              assert e.indexOf 'login'
              done()

      context 'with id', ->
        beforeEach ->
          localStorage.setItem('login-id', 'yyy')

        it 'pass through without fetching id', ->
          kaita.commands.ensureUserId()
          .then ->
            assert localStorage.getItem('login-id'), 'yyy'

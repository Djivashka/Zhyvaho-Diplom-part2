
it('Get all posts', () => {
  cy.request({
    method: 'GET',
    url: '/posts',
  }).then(response => {
    expect(response.status).to.be.eq(200);
  })
})

it('Get first 10 posts', () => {
    cy.request({
      method: 'GET',
      url: '/posts?userId=1',
  }).then(response => {
    expect(response.status).to.be.eq(200);
    expect(response.body[0,1,2,3,4,5,6,7,8,9].userId).to.be.eq(1)  // щось на даунічах не можу доперти як зробити цю перевірку нормальною
  })

})

it('Get posts with id = 55 and id = 60', () => {
  cy.request({
    method: 'GET',
    url: '/posts?id=55&id=60',
}).then(response => {
  expect(response.status).to.be.eq(200);
  expect(response.body[0].id).to.be.eq(55)
  expect(response.body[1].id).to.be.eq(60)
})

})

it('Create a post', () => {
  cy.request({
    method: 'POST',
    url: '/664/posts',
    failOnStatusCode: false
}).then(response => {
  expect(response.status).to.be.eq(401);
})

})

// it('Register', () => {
//   cy.request({
//     method: 'POST',
//     url: '/register',
//     body: {
//       "email": "olivier@mail.com",
//       "password": "bestPassw0rd"
//     }
// }).then(response => {
//   expect(response.status).to.be.eq(200); 
// })

// })

it ('Create post with adding access token in header', () => {
  cy.request({
    method: 'POST',
    url: '/signin',
    body: {
      "email": "olivier@mail.com",
      "password": "bestPassw0rd"
    }

}).then(response => {
  let token = response.body
  cy.log(token.accessToken)
  cy.request({
    method: 'POST',
    url: 'posts/664/users/',
    // headers: {'Authorization':`Bearer ${token.accessToken}`},
    Authorization: `Bearer ${token.accessToken}` 
  }).then(response => {
    expect(response.status).to.be.eq(201);
  })
})

})

it('Create post entity', () => {
  cy.request({
    method: 'POST',
    url: '/posts',
    body: {'user': 'sdafasfas'}
  }).then(response => {
    expect(response.status).to.be.eq(201);
    expect(response.body.user).to.be.eq('sdafasfas')
  })
})

it('Update non-existing entity', () => {
  cy.request({
    method: 'PUT',
    url: '/posts',
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.be.eq(404);
  })
  
})

it ('Create post entity and update the created entity', () => {
  cy.request({
    method: 'POST',
    url: '/posts',
    body: {'user': 'sdafasfas'}
  }).then(response => {
    let userId = response.body.id
    cy.log(userId)
    cy.request({
      method: 'PUT',
      url: `/posts/${userId}`,
      body: {'user': 'asdfdasfas'}
    }).then(response => {
      expect(response.body).to.be.eql({'user': 'asdfdasfas', 'id': userId});
    })
  })
})


it('Delete non-existing post entity', () => {
  cy.request({
    method: 'DELETE',
    url: '/posts',
    failOnStatusCode: false
  }).then(response => {
    expect(response.status).to.be.eq(404);
  })
  
})

it('Create post entity and update the created entity', () => {
  cy.request({
    method: 'POST',
    url: '/posts',
    body: {'user': 'sdafasfas'}
  }).then(response => {
    let userId = response.body.id
    cy.log(userId)
    cy.request({
      method: 'DELETE',
      url: `/posts/${userId}`,
      body: {'user': 'sdafasfas'},
      failOnStatusCode: false
    })
    cy.request({
      method: 'GET',
      url: `/posts/${userId}`,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.be.eq(404);
    })
  })
})


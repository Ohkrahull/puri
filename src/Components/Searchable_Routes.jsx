import { CalendarDots, Siren } from "@phosphor-icons/react";
import { ArrowsClockwise, Buildings, ChatText, Files, Megaphone, NotePencil, Package, SquaresFour, UserCirclePlus, UserList,UserCirclec ,UserCircle, Gift } from "phosphor-react";

export const SEARCHABLE_ROUTES = [
    // Dashboard
    {
      category: 'Navigation',
      items: [
        { 
          name: 'Dashboard', 
          icon: SquaresFour,
          path: '/',
          breadcrumb: ['Dashboard']
        }
      ]
    },
  
    // Flat Management Section
    {
      category: 'Flat Management',
      items: [
        { 
          name: 'Flat Management', 
          icon: Buildings,
          path: '/flatmain',
          breadcrumb: ['Flat Management']
        },
        { 
          name: 'Add Flat', 
          icon: Buildings,
          path: '/flatmain',
          breadcrumb: ['Flat Management', 'Add Flat']
        },
        { 
            name: 'Export Flat', 
            icon: Buildings,

            path: '/flatmain',
            breadcrumb: ['Flat Management', 'Export']
          }
      ]
    },
  
    // User Requests Section
    {
      category: 'User Requests',
      items: [
        { 
          name: 'User Requests', 
          icon: UserCirclePlus ,
          path: '/UserRequests',
          breadcrumb: ['User Requests']
        },
        { 
            name: 'Export User Requests', 
            icon: UserCirclePlus ,

            path: '/UserRequests',
            breadcrumb: ['User Requests','Export']
          }
      ]
    },
  
    // Facility Section
    {
      category: 'Facility',
      items: [
        { 
          name: 'Facility', 
          icon: Buildings,

          path: '/Facility',
          breadcrumb: ['Facility']
        },
        { 
          name: 'Add Amenity',
          icon: Buildings,
 
          path: '/Amenityform',
          breadcrumb: ['Facility', 'Add Amenity']
        },
        // { 
        //   name: 'Edit Amenity', 
        //   path: '/Amenityform',
        //   breadcrumb: ['Facility', 'Edit Amenity']
        // }
      ]
    },
  
    // Bookings Section
    {
      category: 'Bookings',
      items: [
        { 
          name: 'Bookings', 
          icon: CalendarDots ,
          path: '/Booking',
          breadcrumb: ['Bookings']
        },
        { 
            name: 'Amenities',
            icon: CalendarDots ,
 
            path: '/Booking',
            breadcrumb: ['Bookings','Amenities']
          },
        { 
          name: 'Add Amenity Booking ',
          icon: CalendarDots ,
 
          path: '/Booking',
          breadcrumb: ['Bookings', 'Amenities','Add Amenity Booking']
        },
        { 
            name: 'Export Amenity Booking ', 
            icon: CalendarDots ,

            path: '/Booking',
            breadcrumb: ['Bookings', 'Amenities','Export']
          }

      ]
    },

    //Services Section
    {
        category: 'Services',
        items: [
          { 
            name: 'Services', 
            icon: CalendarDots ,

            path: '/Booking',
            breadcrumb: ['Bookings']
          },
         
          { 
            name: 'Add Services Booking ',
            icon: CalendarDots ,
 
            path: '/Booking',
            breadcrumb: ['Bookings', 'Amenities','Add Services Booking']
          },
          { 
              name: 'Export Services Booking ', 
              icon: CalendarDots ,

              path: '/Booking',
              breadcrumb: ['Bookings', 'Amenities','Export']
            }
  
        ]
      },

  
    // Visitors Section
    {
      category: 'Visitors',
      items: [
        { 
          name: 'Guests', 
          icon: UserList  ,
          path: '/Guest',
          breadcrumb: ['Visitors', 'Guests']
        },
        { 
          name: 'Helpers', 
          icon: UserList  ,

          path: '/Helper',
          breadcrumb: ['Visitors', 'Helpers']
        },
        { 
          name: 'Delivery', 
          icon: UserList  ,

          path: '/Delivery',
          breadcrumb: ['Visitors', 'Delivery']
        },
        { 
          name: 'Cab', 
          icon: UserList  ,

          path: '/Cab',
          breadcrumb: ['Visitors', 'Cab']
        },
        { 
          name: 'Other Visitors', 
          icon: UserList  ,

          path: '/Other',
          breadcrumb: ['Visitors', 'Other']
        }
      ]
    },
  
    // Parcels Section
    {
      category: 'Parcels',
      items: [
        { 
          name: 'Parcels', 
          icon: Package  ,
          path: '/Parcels',
          breadcrumb: ['Parcels']
        }
      ]
    },
  
    // Notices Section
    {
      category: 'Notices',
      items: [
        { 
          name: 'Notices',
            icon: Megaphone  , 
          path: '/Notices',
          breadcrumb: ['Notices']
        },
        { 
          name: 'Add Notice',
          icon: Megaphone  , 
 
          path: '/Noticeform',
          breadcrumb: ['Notices', 'Add Notice']
        },
        { 
            name: 'Export Notice', 
            icon: Megaphone  , 

            path: '/Noticeform',
            breadcrumb: ['Notices', 'Export']
          }
      ]
    },
  
    // SOS History
    {
      category: 'Emergency',
      items: [
        { 
          name: 'SOS History', 
          icon: Siren  ,
          path: '/sosHistory',
          breadcrumb: ['SOS History']
        },
        { 
            name: 'Export SOS History', 
            icon: Siren  ,

            path: '/sosHistory',
            breadcrumb: ['SOS History','Export']
          }
      ]
    },
  
    // Feedback Section
    {
      category: 'Feedback',
      items: [
        { 
          name: 'Feedback', 
          icon: ChatText  ,
          path: '/feedback',
          breadcrumb: ['Feedback']
        },
        { 
          name: 'Add Feedback', 
          icon: ChatText  ,

          path: '/feedbackForm',
          breadcrumb: ['Feedback', 'Add Feedback']
        },
        { 
          name: 'Export Feedback',
          icon: ChatText  ,
 
          path: '/feedbackForm',
          breadcrumb: ['Feedback', 'Export']
        },
        // { 
        //   name: 'Not Found Feedback', 
        //   path: '/notFoundFeedback',
        //   breadcrumb: ['Feedback', 'Not Found']
        // }
      ]
    },
  
    // Special Requests
    {
      category: 'Special Requests',
      items: [
        { 
          name: 'Special Requests', 
          icon: NotePencil  ,
          path: '/special_request',
          breadcrumb: ['Special Requests']
        },
        { 
          name: ' Export Special Request ',
          icon: NotePencil  ,
 
          path: '/special_request',
          breadcrumb: ['Special Requests', 'Export']
        }
      ]
    },
  
    // Documents
    {
      category: 'Documents',
      items: [
        { 
          name: 'Documents', 
          icon: Files  ,
          path: '/document',
          breadcrumb: ['Documents']
        }
      ]
    },
  
    // Construction
    {
      category: 'Construction',
      items: [
        { 
          name: 'Construction Update', 
          icon:ArrowsClockwise,
          path: '/construction',
          breadcrumb: ['Construction Update']
        },
        
        { 
          name: 'Add Construction Update', 
          icon:ArrowsClockwise,

          path: '/constructionupdate',
          breadcrumb: ['Construction Update', 'Add']
        }
      ]
    },
  
    // Users Section
    {
      category: 'Users',
      items: [
        { 
          name: 'Staff Users', 
          icon: UserCircle  ,
          path: '/user',
          breadcrumb: ['Users', 'Staff']
        },
        { 
          name: 'Referrals', 
          icon: UserCircle  ,

          path: '/referrals',
          breadcrumb: ['Users', 'Referrals']
        },
        // { 
        //   name: 'Referral Details', 

        //   path: '/referalNext',
        //   breadcrumb: ['Users', 'Referrals', 'Details']
        // },
        // { 
        //   name: 'Referral Details (with ID)', 
        //   path: '/referalNext/:id',
        //   breadcrumb: ['Users', 'Referrals', 'Details']
        // },
        { 
          name: 'Residents', 
          icon: UserCircle  ,

          path: '/Resident',
          breadcrumb: ['Users', 'Residents']
        },
        { 
          name: 'Guest Login', 
          icon: UserCircle  ,

          path: '/GuestLogin',
          breadcrumb: ['Users', 'Guest Login']
        }
      ]
    },
  
    // Helper Management
    {
      category: 'Helper Management',
      items: [
        { 
          name: 'Add Helper', 
          icon: UserCircle  ,

          path: '/AddHelper',
          breadcrumb: ['Users', 'Helpers', 'Add Helper']
        },
        { 
          name: 'New Helper', 
          icon: UserCircle  ,

          path: '/AddNewHelper',
          breadcrumb: ['Users', 'Helpers', 'New Helper']
        }
      ]
    },
  
    // Guard Management
    {
      category: 'Guard Management',
      items: [
        { 
          name: 'Add Guard', 
          icon: UserCircle  ,

          path: '/AddGuard',
          breadcrumb: ['Users', 'Guards', 'Add Guard']
        },
        { 
          name: 'New Guard', 
          icon: UserCircle  ,

          path: '/AddNewGuard',
          breadcrumb: ['Users', 'Guards', 'New Guard']
        },
        // { 
        //   name: 'Edit Guard', 
        //   path: '/AddNewGuard/:id',
        //   breadcrumb: ['Users', 'Guards', 'Edit Guard']
        // }
      ]
    },
  
    // Support
    {
      category: 'Support',
      items: [
        { 
          name: 'Support', 
          icon: Gift   ,
          path: '/support',
          breadcrumb: ['Support']
        },
        // { 
        //   name: 'Support View', 
        //   path: '/support_view/:id',
        //   breadcrumb: ['Support', 'View']
        // }
      ]
    },
  
    // Rental Requests
    {
      category: 'Rental Requests',
      items: [
        { 
          name: 'Rental Requests', 
          icon: NotePencil,
          path: '/Rental_request',
          breadcrumb: ['Rental Requests']
        },
        { 
          name: 'Owner', 
          icon: NotePencil,

          path: '/Owner',
          breadcrumb: ['Rental Requests', 'Owner']
        },
        { 
          name: 'Tenant', 
          icon: NotePencil,

          path: '/Tenant',
          breadcrumb: ['Rental Requests', 'Tenant']
        }
      ]
    }
  ];
  
  export default SEARCHABLE_ROUTES;
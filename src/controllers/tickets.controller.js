import Ticket from '../models/ticket.js';

export const getMyTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ purchaser: req.user.email })
        .sort({ purchase_datetime: -1 });

        res.json({
        status: 'success',
        data: { tickets }
        });
    } catch (error) {
        next(error);
    }
};

export const getTicketById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                status: 'error',
                message: 'Ticket no encontrado'
            });
    }

    // Verificar que el ticket pertenezca al usuario
    if (ticket.purchaser !== req.user.email) {
      return res.status(403).json({
        status: 'error',
        message: 'No tienes permiso para ver este ticket'
      });
    }

    res.json({
      status: 'success',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};
